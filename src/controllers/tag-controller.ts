import controller from "./controller";
import type { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import Tag from "../entities/Tag.js";
import { Like } from "typeorm";

const tagRepository = AppDataSource.getRepository(Tag);

export default class TagController extends controller {
  async create(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    const tag = new Tag();
    tag.name = name;

    const newTag: Tag = await tagRepository.save(tag);

    if (!newTag) {
      res.status(500).json({ message: "Failed to create tag" });
      return;
    }
    res.status(201).json(newTag);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const tags = await tagRepository.find();
    res.status(200).json(tags);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, status } = req.body;

    if (!id) {
      res.status(400).json({ message: "Tag ID is required" });
      return;
    }

    const tagToUpdate = await tagRepository.findOneBy({ id: parseInt(id, 10) });

    if (!tagToUpdate) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    tagToUpdate.name = name || tagToUpdate.name;
    tagToUpdate.status = status ?? tagToUpdate.status;

    const updatedTag = await tagRepository.save(tagToUpdate);
    res.status(200).json(updatedTag);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Tag ID is required" });
      return;
    }

    const tagToDelete = await tagRepository.findOneBy({ id: parseInt(id, 10) });

    if (!tagToDelete) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    await tagRepository.remove(tagToDelete);
    res.status(200).json({ message: "Tag deleted successfully" });
  }

  async paginate(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const name = req.query.name as string | undefined;

    const skip = (page - 1) * limit;

    const [tags, total] = await tagRepository.findAndCount({
      skip,
      take: limit,
      where: {
        ...(name && { name: Like(`%${name}%`) }),
      },
    });

    res.status(200).json({
      data: tags,
      total,
      page,
      last_page: Math.ceil(total / limit),
    });
  }
}
