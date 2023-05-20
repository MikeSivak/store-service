import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar', length: 120 })
    public from: string;

    @Column({ type: 'varchar', length: 120 })
    public to: string;

    @Column({ type: 'varchar', length: 120 })
    public value: string;

    @Column({ type: 'varchar', length: 120 })
    public blockNumber: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt!: Date;
}