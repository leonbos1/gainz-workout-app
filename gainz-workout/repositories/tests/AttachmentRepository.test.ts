import { AttachmentRepository } from "@/repositories/AttachmentRepository";
import { Attachment } from "@/datamodels/Attachment";
import db from "@/database/database";

jest.mock("@/database/database", () => ({
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
}));

describe("AttachmentRepository", () => {
    let repository: AttachmentRepository;

    beforeEach(async () => {
        repository = new AttachmentRepository('attachment');
        await repository.initTable();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize the table", async () => {
        expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS attachment"));
    });

    it("should get all attachment", async () => {
        const mockData = [{ id: 1, name: "Test Attachment", createdAt: "2024-01-01", updatedAt: "2024-01-02" }];
        (db.getAllAsync as jest.Mock).mockResolvedValue(mockData);

        const result = await repository.getAll();

        expect(db.getAllAsync).toHaveBeenCalledWith("SELECT * FROM attachment");
        expect(result).toEqual(mockData);
    });

    it("should get an attachment by ID", async () => {
        const mockData = [{ id: 1, name: "Test Attachment", createdAt: "2024-01-01", updatedAt: "2024-01-02" }];
        (db.getAllAsync as jest.Mock).mockResolvedValue(mockData);

        const result = await repository.getById(1);

        expect(db.getAllAsync).toHaveBeenCalledWith("SELECT * FROM attachment WHERE id = ?", [1]);
        expect(result).toEqual(mockData[0]);
    });

    it("should return null if attachment is not found by ID", async () => {
        (db.getAllAsync as jest.Mock).mockResolvedValue([]);

        const result = await repository.getById(99);

        expect(db.getAllAsync).toHaveBeenCalledWith("SELECT * FROM attachment WHERE id = ?", [99]);
        expect(result).toBeNull();
    });

    it("should create an attachment", async () => {
        const mockEntity = { name: "New Attachment" };
        (db.runAsync as jest.Mock).mockResolvedValue({ lastInsertRowId: 1 });

        const result = await repository.create(mockEntity);

        expect(db.runAsync).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO attachment"),
            expect.arrayContaining(["New Attachment"])
        );
        expect(result).toBe(1);
    });

    it("should update an attachment", async () => {
        const updates = { name: "Updated Attachment" };

        await repository.update(1, updates);

        expect(db.runAsync).toHaveBeenCalledWith(
            expect.stringContaining("UPDATE attachment SET name = ? WHERE id = ?"),
            ["Updated Attachment", 1]
        );
    });

    it("should delete an attachment", async () => {
        await repository.delete(1);

        expect(db.runAsync).toHaveBeenCalledWith(
            expect.stringContaining("DELETE FROM attachment WHERE id = ?"),
            [1]
        );
    });
});
