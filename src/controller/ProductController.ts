import { Response } from "express";
import { myDataBase } from "../../db";
import { Product } from "../entity/Product";
import { UploadS3Request } from "../interface/interfaces";
import { Category } from "../entity/Category";
import { In } from "typeorm";

export class ProductController {
	static productRepo;
  static initialize() {
    this.productRepo = myDataBase.getRepository(Product);
	}
	
	static createProduct = async (req:UploadS3Request, res:Response) => {
		const { productCode, productName, price, categoryIds } = req.body;
		const categoryRepo = myDataBase.getRepository(Category)
		const categories = await categoryRepo.find({
			where: {
				categoryId:In(categoryIds)
			}
		})
		const thumbnail = req.files.find(file => file.fieldname === 'thumbnail')   
		const productInfoImage = req.files.find(file => file.fieldname === 'productInfoImage');
		const isEmpty = productCode.trim() === '' && productName.trim() === '' &&  price.trim() ===''
    const isNan = Number.isNaN(Number(price));
		if (isEmpty) {
      return res.status(400).json({ message: '상품 등록시 공백란 없어야합니다' });
    }
		if (isNan) {
			return res.status(400).json({message: '상품 가격을 숫자로 적어주세요'})
		}

		const product = new Product();
    product.productName = productName;
    product.productCode = productCode;
		product.price = parseInt(price);
		thumbnail && (product.thumbnail = thumbnail.location);
		productInfoImage && (product.productInfoImage = productInfoImage.location);
		product.categories = categories;
    
    const result = await this.productRepo.insert(product);

    res.status(201).json({ message: '상품이 등록되었습니다.' });
	}
}