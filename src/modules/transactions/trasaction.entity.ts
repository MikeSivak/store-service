import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['hash'])
export class Transaction {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar', length: 120 })
    public hash: string;

    @Column({ type: 'varchar', length: 120 })
    public from: string;

    @Column({ type: 'varchar', length: 120, nullable: true })
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