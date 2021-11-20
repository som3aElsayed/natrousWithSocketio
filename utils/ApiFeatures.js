class ApiFeatures {
  constructor(tours, queries) {
    this.tours = tours;
    this.query = queries;
  }
  filter() {
    let filterQueries = { ...this.query };
    const filters = ["name", "difficulty", "price"];
    Object.entries(filterQueries).map((q) => {
      if (filters.indexOf(q[0]) === -1) delete filterQueries[q[0]];
    });
    if (filterQueries.price) {
      filterQueries.price = JSON.parse(
        JSON.stringify(filterQueries.price).replace('"', () => '"$')
      );
    }
    this.tours = this.tours.find(filterQueries);
    return this;
  }
  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      console.log(sortBy);
      this.tours = this.tours.sort(sortBy);
    } else {
      this.tours = this.tours.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.query.select) {
      const selectedBy = this.query.select.split(",").join(" ");
      this.tours = this.tours.select(selectedBy);
    }
    return this;
  }
  paginate() {
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.tours = this.tours.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
