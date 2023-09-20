import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	productId: string;
	@Column()
	shopName: string;
	@Column()
	discount: number;
	@Column()
	productName: string;
	@Column( 'simple-array' ,{nullable: true })
	productInfoImages: string[];
	@Column()
	price: number
	@ManyToMany(() => Category, (category) => category.products)
	@JoinTable({
		name: 'productCategories',
		joinColumn: {
			name: 'productId',
			referencedColumnName: 'productId'
		},
		inverseJoinColumn: {
			name: 'categoryId',
			referencedColumnName: 'categoryId'
		}
	})
	categories: Category[]
	@CreateDateColumn()
	createdAt: Date
	@UpdateDateColumn()
	updatedAt: Date
}