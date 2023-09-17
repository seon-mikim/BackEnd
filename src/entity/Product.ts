import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
	productId: string;
	@Column()
	productCode: string;
	@Column()
	productName: string;
	@Column()
	thumbnail: string;
	@Column()
	productInfoImage: string;
	@Column()
	price: number
}