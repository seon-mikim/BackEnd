import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;
	@Column({ unique: true })
	userId: string;
	@Column({ unique: true })
	password: string;
	@Column()
	userName: string;
	@Column()
	phoneNumber: string;
	@Column()
	userEmail: string;
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
}