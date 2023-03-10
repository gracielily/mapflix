export function getImagePublicId(imageUrl) {
    return imageUrl.split("/").slice(-1)[0].split(".")[0]
}

export const IMAGE_PAYLOAD = {
    multipart: true,
    output: "data",
    maxBytes: 209715200,
    parse: true,
  }