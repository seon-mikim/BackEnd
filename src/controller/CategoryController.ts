import { Response } from "express";
import { JwtRequest } from "../interface/interfaces";
import { Category } from "../entity/Category";
import { myDataBase } from "../../db";

export class CategoryController {
  static createCategory = async (req: JwtRequest, res: Response) => {
    const { categoryName } = req.body;
    const isEmpty = categoryName.trim() === "";
    if (isEmpty) {
      res.status(404).json({ message: "카테고리 값이 비었습니다." });
      return;
    }
    try {
      const existingCategory = await myDataBase.getRepository(Category).findOne({ where: { categoryName } });

      if (existingCategory) {
        res.status(400).json({ message: "이미 존재하는 카테고리입니다." });
        return;
      }

      const category = new Category();
      category.categoryName = categoryName;
      const result = await myDataBase.getRepository(Category).insert(category);
      res.status(200).json({ message: "카테고리가 등록되었습니다." });
    } catch (error) {
      res.status(500).json({ message: "카테고리 등록 중 오류가 발생했습니다." });
    }
  };
}
