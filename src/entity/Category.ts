import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity() 
export class Category {
	@PrimaryGeneratedColumn()
	categoryId: string;
	@Column()
	categoryName: string;
	@ManyToMany(() => Product, (product) => product.categories)
	products:Product[]
}