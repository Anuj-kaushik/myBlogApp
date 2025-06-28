import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        // call another method
        return this.login(email, password);
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Appwrite service :: creatEAccount : ", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite service :: login : ", error);
      throw error();
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser : ", error);
      // throw new error
      return null; // if try catch does not able to work this stmt will return null
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions("all");
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;

//now via this authService object all the methods are accessible with a . dot notation
//and services are created in such a way that the working is only inside this file, all the required changes are done in this file only when application changes in future or backend service get changed
// frontend will not get awareness about it as all it know the parameter are as it is
// this is a future proof code of authentication, which can be referred in future
