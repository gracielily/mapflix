import chai;

suite("404 Redirect Tests", () => {

  test("Redirects to 404 Page when url not recognised", async () => {
    chai.request('http://localhost:3000')
  .get('/')

  });


});
