class Voxel {
    constructor(typeId) {
        this.typeId = typeId;
    }

    isAir() {
        return this.typeId === 0;
    }

    getTypeId() {
        return this.typeId;
    }

    static create(typeId) {
        return new Voxel(typeId);
    }
}

export default Voxel;
