import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.gbb.fooddelivery",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: "69376dcf00307eff167d",
    bucketId: "69506e7f0031ae7ebce7",
    userCollectionId: "696189970016dd960a5c",
    categoriesCollectionId: "6950808f000a43c2ffdd",
    menuCollectionId: "695080f5003a999b528d",
    customizationsCollectionId: "695081c000028bcf1ce1",
    menuCustomizationsCollectionId: "69507ff300163682cda4",
    userProfileCollectionId: "6961709b003d02029361",
}

export const client = new Client()

client
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);


export const createUser = async ({ email, password, name }: CreateUserParams) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (!newAccount) throw new Error("Failed to create account");

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      newAccount.$id, // 👈 MISMO ID
      {
        email,
        name,
        accountId: newAccount.$id,
        avatar: avatarUrl,
      }
    );

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userProfileCollectionId,
      newAccount.$id,
      {
        accountId: newAccount.$id,
        phone: null,
        address: null,
      }
    );

    return true;
  } catch (error) {
    throw new Error(error as string);
  }
};


export const signIn = async ({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        )
    } catch (error) {
        throw new Error(error as string)
    }
}

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw new Error(error as string);
  }
};


export const getCurrentUser = async () => {
    try {
        const currectAccount = await account.get();
        if(!currectAccount) throw Error("No user logged in");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal("accountId", [currectAccount.$id])
            ]
        )
        if(!currentUser) throw Error("User not found");
        console.log(currentUser.documents[0]);
        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getMenu = async ({category, query}: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) {
            queries.push(Query.equal("categories", category));
        }

        if(query) {
            queries.push(Query.search("name", query));
        }

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        );

        return menus.documents;

    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId
        );

        return categories.documents;
    } catch (error) {
        throw new Error(error as string)
    }
}

export const updateProfile = async (data: {[key: string]: any}) => {
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser) throw Error("User not found");
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userProfileCollectionId,
            currentUser.$id,
            data
        );
        return updatedUser;
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getFullUser = async () => {
  try {
    // Account (auth)
    const accountData = await account.get();
    if (!accountData) throw new Error("No authenticated user");

    const userId = accountData.$id;

    // USER
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // PROFILE
    const profile = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userProfileCollectionId,
      userId
    );

    // Clean merge
    return {
      id: userId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: profile.phone ?? "",
      address: profile.address ?? "",
    };
  } catch (error) {
    throw new Error(error as string);
  };
}