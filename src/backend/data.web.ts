import { webMethod, Permissions } from "@wix/web-methods";
import { collections, items } from "@wix/data";
import { auth } from "@wix/essentials";
import { files, folders } from "@wix/media";
import { appPermissions } from "@wix/app-management";

export const createTestimonialCMS = webMethod(Permissions.Anyone, async () => {
  try {
    const elevatedCreateDataCollection = auth.elevate(
      collections.createDataCollection
    );
    const response = await elevatedCreateDataCollection({
      _id: "testimonials",
      displayName: "Testimonial",
      fields: [
        {
          key: "name",
          displayName: "name",
          type: "TEXT",
          //  required: true
        },
        {
          key: "email",
          displayName: "email",
          type: "TEXT",
          // required: true
        },
        { key: "phone", displayName: "phone", type: "TEXT" },
        { key: "company", displayName: "company", type: "TEXT" },
        { key: "jobTitle", displayName: "jobTitle", type: "TEXT" },
        {
          key: "testimonialText",
          displayName: "testimonialText",
          type: "TEXT",
          // required: true,
        },
        { key: "photo", displayName: "photo", type: "OBJECT" },
        {
          key: "video",
          displayName: "video",
          type: "OBJECT",
          // required: true,
        },
        {
          key: "rating",
          displayName: "rating",
          type: "NUMBER",
          // required: true,
        },
        {
          key: "status",
          displayName: "status",
          type: "TEXT",
        },
        {
          key: "videoUrl",
          displayName: "videoUrl",
          type: "TEXT",
        },
        {
          key: "avatarUrl",
          displayName: "avatarUrl",
          type: "TEXT",
        },
        {
          key: "tag",
          displayName: "tag",
          type: "TEXT",
        },
        {
          key: "videoThumbnail",
          displayName: "videoThumbnail",
          type: "TEXT",
        },
        {
          key: "submittedAt",
          displayName: "submittedAt",
          type: "TEXT",
        },
      ],

      permissions: {
        insert: "ANYONE",
        read: "ANYONE",
        remove: "ANYONE",
        update: "ANYONE",
      },
    });

    console.log("response: ", response);

    return response;
  } catch (error) {
    console.log(
      "Error from backend myCreateDataCollectionMethod function: ",
      error
    );
    throw error;
  }
});

export const getVideoUploadUrl = webMethod(
  Permissions.Anyone,
  async (randomId = Date.now()) => {
    const elevatedGenerateFileUploadUrl = auth.elevate(
      files.generateFileUploadUrl
    );

    try {
      const mimeType = "video/webm";
      const fileName = `testimonial-${randomId}.webm`;
      const parentFolderId = "9807d129249348e79087a87b9a399602"; // default: media-root

      const { uploadUrl } = await elevatedGenerateFileUploadUrl(mimeType, {
        fileName,
        parentFolderId: parentFolderId,
      });

      console.log("Upload URL:", uploadUrl);
      return uploadUrl;
    } catch (error) {
      console.log("error from getUploadUrl backend funtion: ", error);
      throw error;
    }
  }
);

export const getPhotoUploadUrl = webMethod(
  Permissions.Anyone,
  async (randomId = Date.now()) => {
    const elevatedGenerateFileUploadUrl = auth.elevate(
      files.generateFileUploadUrl
    );

    try {
      const mimeType = "image/jpeg";
      const fileName = `user-${randomId}.jpg`;
      const parentFolderId = "9807d129249348e79087a87b9a399602"; // default: media-root

      const { uploadUrl } = await elevatedGenerateFileUploadUrl(mimeType, {
        fileName,
        parentFolderId: parentFolderId,
      });

      console.log("Upload URL:", uploadUrl);
      return uploadUrl;
    } catch (error) {
      console.log("error from getUploadUrl backend funtion: ", error);
      throw error;
    }
  }
);

export const getAllCollections = webMethod(Permissions.Anyone, async () => {
  try {
    const elevatedListDataCollections = auth.elevate(
      collections.listDataCollections
    );
    const response = await elevatedListDataCollections();
    return response;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
});

export const saveData = webMethod(Permissions.Anyone, async (toSave) => {
  try {
    const saveData = await items.save("testimonials", toSave);
    return saveData;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
});

export const getAllTestimonialData = webMethod(Permissions.Anyone, async () => {
  try {
    async function hasTestimonialsCollection() {
      const { collections = [] } = await getAllCollections();
      return collections.some((item) => item._id === "testimonials");
    }

    if (await hasTestimonialsCollection()) {
      console.log("Testimonials collection আছে!");

      const data = await items.query("testimonials").find();
      if (data.items.length > 0) {
        return data.items;
      } else {
        return [];
      }
    } else {
      console.log("Testimonials collection নেই");
      // const createCMS = await createTestimonialCMS();
      // console.log("create CMS: ", createCMS);
      return [];
    }
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
});

export const getApprovedTestimonialData = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      async function hasTestimonialsCollection() {
        const { collections = [] } = await getAllCollections();
        return collections.some((item) => item._id === "testimonials");
      }

      if (await hasTestimonialsCollection()) {
        console.log("Testimonials collection আছে!");

        const data = await items
          .query("testimonials")
          .eq("status", "approved")
          .find();
        if (data.items.length > 0) {
          return data.items;
        } else {
          return [];
        }
      } else {
        console.log("Testimonials collection নেই");
        // const createCMS = await createTestimonialCMS();
        // console.log("create CMS: ", createCMS);
        return [];
      }
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }
);

// export async function doesCollectionExist() {
//   try {
//     const collectionName = "COLLECTION_NAME";
//     // Retrieve all collections
//     const response = await collections.listDataCollections();
//     const collectionsList = response.collections;

//     // Check if the collection exists
//     const collectionExists = collectionsList.some(
//       (collection) => collection._id === collectionName
//     );

//     return collectionExists;
//   } catch (error) {
//     console.error("Error checking collection existence:", error);
//     throw error;
//   }
// }

export async function addManageMediaManagerPermission() {
  const APP_ID = "2c35134c-d362-4231-a85a-b117aa0e4f40";

  const appPermission = {
    appId: APP_ID,
    permission: {
      permissionId: "SCOPE.DC-MEDIA.MANAGE-MEDIAMANAGER",
    },
  };

  try {
    const response = await appPermissions.createAppPermission(appPermission);
    console.log("Permission added:", response);
  } catch (error) {
    console.error("Error adding permission:", error);
    throw error;
  }
}

export const getFolderList = webMethod(Permissions.Anyone, async () => {
  try {
    const elevatedListFolders = auth.elevate(folders.listFolders);
    const foldersList = await elevatedListFolders();

    console.log("Folders:", foldersList);
    return foldersList;
  } catch (error) {
    console.error(error);
    throw error;
    // Handle the error
  }
});
