import { StorageManager, LocalFileSystemStorage } from "@slynova/flydrive"
import path from "path"
import appRoot from "app-root-path"
import { AmazonWebServicesS3Storage } from "@slynova/flydrive-s3"

const production = process.env.NODE_ENV === "production"

let storage: StorageManager

if (!production || process.env.APP_ENV === "test") {
  storage = new StorageManager({
    default: "local",

    disks: {
      local: {
        driver: "local",
        config: {
          root: path.join(appRoot.toString(), "storage"),
        },
      },
    },
  })

  storage.registerDriver("local", LocalFileSystemStorage)
} else {
  storage = new StorageManager({
    default: "s3",
    disks: {
      s3: {
        driver: "s3",
        config: {
          key: process.env.S3_KEY,
          endpoint: process.env.S3_ENDPOINT,
          secret: process.env.S3_SECRET,
          bucket: process.env.S3_BUCKET,
          region: process.env.S3_REGION,
        },
      },
    },
  })

  storage.registerDriver("s3", AmazonWebServicesS3Storage)
}

export const disk =
  !production || process.env.APP_ENV === "test"
    ? storage.disk<LocalFileSystemStorage>("local")
    : storage.disk<AmazonWebServicesS3Storage>("s3")

export const driver =
  !production || process.env.APP_ENV === "test" ? "local" : "s3"
