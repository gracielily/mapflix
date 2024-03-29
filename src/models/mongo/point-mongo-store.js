import { Point } from "./point.js";

export const pointMongoStore = {
    async getAll() {
        const points = await Point.find().lean();
        return points;
    },

    async getAllPublic(){
        const points = await Point.find({ isPublic: true}).lean();
        return points;
    },

    async create(showId, point) {
        point.showId = showId;
        const createdPoint = await new Point(point).save();
        return this.getById(createdPoint._id);
    },

    async getPublicByShowId(showId) {
        if (showId) {
            const points = await Point.find({ showId: showId, isPublic: true }).lean();
            return points;
        }
        return null;
    },

    async getByShowId(showId) {
        if (showId) {
            const points = await Point.find({ showId: showId }).lean();
            return points;
        }
        return null;
    },

    async getById(id) {
        if (id) {
            const point = await Point.findOne({ _id: id }).lean();
            return point;
        }
        return null;
    },

    async delete(id) {
        try {
            await Point.deleteOne({ _id: id });
        } catch (error) {
            console.log("Invalid Point ID");
        }
    },

    async deleteAll() {
        await Point.deleteMany({});
    },

    async update(currentPoint, updatedPoint) {
        const point = await this.getById(currentPoint._id);
        if (point) {
            await Point.updateOne(
                { _id: currentPoint._id },
                {
                    name: updatedPoint.name,
                    latitude: updatedPoint.latitude,
                    longitude: updatedPoint.longitude,
                    description: updatedPoint.description,
                    publicTransport: updatedPoint.publicTransport,
                    wheelchairAccesible: updatedPoint.wheelchairAccesible,
                    facilitiesAvailable: updatedPoint.facilitiesAvailable,
                    images: updatedPoint.images,
                    isPublic: updatedPoint.isPublic,
                });
        }
    },
};
