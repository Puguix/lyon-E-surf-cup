// create Mongoose data model for surfers

module.exports = (mongoose) => {
    var schema = mongoose.Schema(
        {
            firstName: String,
            lastName: String,
            nationality: String,
            age: String,
            isLive: Boolean,
            liveLink: String,
            avatar: String,
            description: String,
        },
        { timestamps: true }
    );
    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    const Surfer = mongoose.model("surfer", schema);
    return Surfer;
};
