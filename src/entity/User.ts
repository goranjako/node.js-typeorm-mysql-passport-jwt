import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert} from 'typeorm'
import * as bcrypt from 'bcryptjs'

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ 
   
  comment: "full name is required"
})
  fullName: string;

  @Column({ unique: true,
    comment: "email name is required"})
  email: string;

  @Column()
  password:string; 

 
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
  
  checkIfUnEncryptedPasswordIsValid (unEncryptedPassword: string): boolean {
   if(  bcrypt.compareSync(unEncryptedPassword, this.password)) return true
   else {return false}
  }
  
}
