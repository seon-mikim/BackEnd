import { Request, Response } from "express";
import { myDataBase } from "../../db";
import { Product } from "../entity/Product";
import { UploadS3Request } from "../interface/interfaces";
import { Category } from "../entity/Category";



export class ProductController {
	static createProduct = async (req:UploadS3Request, res:Response) => {
		const { discount, productName, price, shopName, categoryWords} = req.body;
		
		const locations = req.files.map(file => file.location);		
		const categoryRepo = myDataBase.getRepository(Category);
		const isEmpty = discount.trim() === '' && productName.trim() === '' &&  price.trim() ===''
    const isNan = Number.isNaN(Number(price));
		if (isEmpty) {
      return res.status(400).json({ message: '상품 등록시 공백란 없어야합니다' });
    }
		if (isNan) {
			return res.status(400).json({message: '상품 가격을 숫자로 적어주세요'})
		}
		try {
			const product = new Product();
			product.productName = productName;
			product.shopName = shopName;
			product.discount = parseInt(discount);
			product.price = parseInt(price);
			product.productInfoImages = locations
			const categories = [];
const categoryNames = categoryWords.split(',').map(word => word.trim());

if (categoryNames && categoryNames.length > 0) {
	for (const categoryName of categoryNames) {
		const existingCategory = await categoryRepo.findOne({ where: { categoryName }, relations: ["products"] });
    if (existingCategory) {
      categories.push(existingCategory);
    }
  }
}
 			product.categories = categories;
			const result = await myDataBase.getRepository(Product).save(product);
	    res.status(201).json({message: '상품등록이 완료되었습니다.'})
		} catch (error) {
			res.status(500).json({message:'상품 등록중 오류가 발생했습니다.'})
 }

	}

	static getProducts = async (req: Request, res: Response) => {
		try {
			const result = await myDataBase.getRepository(Product).find()
			res.status(200).json(result)
		} catch (error) {
			res.status(500).json({ message: '상품 조회중 오류가 발생했습니다.' })
		}
	}
	
static getProductsByCategoryName = async (req: Request, res: Response) => {
  const categoryName = req.query.categoryName;
	const productRepository = myDataBase.getRepository(Product);
	if (!categoryName) {
    return res.status(400).json({message: '카테고리 이름이 필요합니다.'});
  }
  
  try {
    const products = await productRepository
      .createQueryBuilder("product")
      .innerJoinAndSelect("product.categories", "category", "category.categoryName = :categoryName", { categoryName })
      .getMany();
      
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
}
}