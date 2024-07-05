
To add sprites tied to Pokémon with the ability to manage multiple sprites (skins) for each Pokémon, you can create a new model called `Sprite`. This model will store information about each sprite, and you can link it to the `Pokemon` model.

Here's how you can extend your schema to include this functionality:

1. **Create a `Sprite` model**: This model will store details about each sprite, including a reference to the `Pokemon` it belongs to and potentially the game or context it is used in.

2. **Update the `Pokemon` model**: Add a relation from `Pokemon` to `Sprite` to represent the many-to-many relationship between Pokémon and their sprites.

Here's the updated `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum PokemonType {
  NORMAL
  FIRE
  WATER
  ELECTRIC
  GRASS
  ICE
  FIGHTING
  POISON
  GROUND
  FLYING
  PSYCHIC
  BUG
  ROCK
  GHOST
  DRAGON
  DARK
  STEEL
  FAIRY
}

enum MoveCategory {
  PHYSICAL
  ELEMENTAL
  ENERGY
  ADAPTABLE
}

enum StorageStatus {
  WITH_TRAINER
  IN_POKEBANK
}

model BaseStats {
  id        Int     @id @default(autoincrement())
  phyAtk    Int
  eleAtk    Int
  eneAtk    Int
  adaAtk    Int
  phyDef    Int
  eleDef    Int
  eneDef    Int
  adaDef    Int
  spd       Int
  hp        Int
  mor       Int
  aff       Int
  foc       Int
  aur       Int
  inst      Int
  syn       Int
  critRate  Int
  critMult  Float
  elemMult  Float
  acc       Int
  toughness Int
  pierce    Int
  pokemon   Pokemon @relation(fields: [pokemonId], references: [id])
  pokemonId Int     @unique
}

model Stats {
  id        Int     @id @default(autoincrement())
  phyAtk    Int
  eleAtk    Int
  eneAtk    Int
  adaAtk    Int
  phyDef    Int
  eleDef    Int
  eneDef    Int
  adaDef    Int
  spd       Int
  hp        Int
  mor       Int
  aff       Int
  foc       Int
  aur       Int
  inst      Int
  syn       Int
  critRate  Int
  critMult  Float
  elemMult  Float
  acc       Int
  toughness Int
  pierce    Int
  userPokemon UserPokemon?
  wildPokemon WildPokemon?
}

model Pokemon {
  id         Int        @id @default(autoincrement())
  name       String
  types      PokemonType[]
  catchRate  Float
  genderRatio Float
  baseStats  BaseStats?
  moves      Move[]
  sprites    Sprite[]
  userPokemon UserPokemon[]
  wildPokemon WildPokemon[]
}

model Sprite {
  id         Int        @id @default(autoincrement())
  url        String
  description String
  pokemon    Pokemon   @relation(fields: [pokemonId], references: [id])
  pokemonId  Int
  context    String?   // Optional field to describe the context (e.g., game, event)
}

model Move {
  id        Int        @id @default(autoincrement())
  name      String
  type      PokemonType
  category  MoveCategory
  power     Int
  accuracy  Float
  pokemon   Pokemon?   @relation(fields: [pokemonId], references: [id])
  pokemonId Int?
}

model User {
  id         Int          @id @default(autoincrement())
  name       String
  email      String       @unique
  password   String
  pokemons   UserPokemon[]
}

model UserPokemon {
  id         Int        @id @default(autoincrement())
  userId     Int
  pokemonId  Int
  user       User       @relation(fields: [userId], references: [id])
  pokemon    Pokemon    @relation(fields: [pokemonId], references: [id])
  stats      Stats?     @relation(fields: [statsId], references: [id])
  statsId    Int?       @unique
  status     StorageStatus
}

model WildPokemon {
  id         Int        @id @default(autoincrement())
  pokemon    Pokemon    @relation(fields: [pokemonId], references: [id])
  pokemonId  Int
  stats      Stats?     @relation(fields: [statsId], references: [id])
  statsId    Int?       @unique
}
```

### Explanation:
- **Sprite Model**: This new model stores the URL of the sprite, a description, a reference to the Pokémon it belongs to, and an optional context (e.g., game, event).
- **Pokemon Model**: A new relation `sprites` is added, which connects to multiple sprites.

### Running Migrations:
After updating your schema, run the following commands to apply the changes to your database:

1. **Generate Migration**:
   ```bash
   npx prisma migrate dev --name add_sprites
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Updating Resolvers:
Update your GraphQL resolvers to handle the new `Sprite` model. For example:

```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    pokemons: () => prisma.pokemon.findMany(),
    userPokemons: (_, { userId }) => prisma.userPokemon.findMany({ where: { userId } }),
    wildPokemons: () => prisma.wildPokemon.findMany(),
    moves: () => prisma.move.findMany(),
  },
  Mutation: {
    createPokemon: (_, { name, types, catchRate, genderRatio, baseStats }) => {
      return prisma.pokemon.create({
        data: {
          name,
          types,
          catchRate,
          genderRatio,
          baseStats: {
            create: baseStats,
          },
        },
      });
    },
    catchPokemon: (_, { userId, pokemonId }) => {
      return prisma.userPokemon.create({
        data: {
          userId,
          pokemonId,
          status: 'WITH_TRAINER',
          stats: {
            create: {}, // Initialize stats here
          },
        },
      });
    },
    createMove: (_, { name, type, category, power, accuracy }) => {
      return prisma.move.create({
        data: {
          name,
          type,
          category,
          power,
          accuracy,
        },
      });
    },
    assignMoveToPokemon: (_, { pokemonId, moveId }) => {
      return prisma.move.update({
        where: { id: moveId },
        data: { pokemonId },
      });
    },
    generateWildPokemon: (_, { pokemonId, level }) => {
      return prisma.wildPokemon.create({
        data: {
          pokemonId,
          stats: {
            create: {}, // Initialize stats based on level here
          },
        },
      });
    },
    updateUserPokemonStatus: (_, { userPokemonId, status }) => {
      return prisma.userPokemon.update({
        where: { id: userPokemonId },
        data: { status },
      });
    },
    createSprite: (_, { pokemonId, url, description, context }) => {
      return prisma.sprite.create({
        data: {
          url,
          description,
          context,
          pokemonId,
        },
      });
    },
  },
};
```

### Adding Sprites:
Add a new mutation `createSprite` to create and link sprites to a Pokémon.

This setup allows you to manage multiple sprites for each Pokémon, providing the flexibility to handle different skins or appearances across various games or contexts.

For asset storage and performance optimization on the frontend, you can follow these best practices:

### Asset Storage:
1. **Use a Cloud Storage Service**:
   - Services like AWS S3, Google Cloud Storage, or Azure Blob Storage are ideal for storing static assets such as images, sprites, and other media files.
   - These services provide high availability, scalability, and global content delivery.

2. **Content Delivery Network (CDN)**:
   - Use a CDN to cache and serve your assets from locations close to your users.
   - CDNs like Cloudflare, AWS CloudFront, and Akamai can significantly reduce latency and improve loading times.

3. **Optimizing Images**:
   - Optimize images before uploading them to reduce file sizes without compromising quality.
   - Use tools like ImageMagick, TinyPNG, or Squoosh to compress images.
   - Serve images in modern formats like WebP for better compression.

### Updating Your Prisma Schema and Resolvers:
Include a field for storing the sprite URL in the `Sprite` model:

```prisma
model Sprite {
  id         Int        @id @default(autoincrement())
  url        String     // URL of the stored sprite
  description String
  pokemon    Pokemon   @relation(fields: [pokemonId], references: [id])
  pokemonId  Int
  context    String?   // Optional field to describe the context (e.g., game, event)
}
```

### Frontend Optimization:
1. **Lazy Loading**:
   - Implement lazy loading to defer loading of non-critical images until they are needed.
   - Libraries like `react-lazyload` or native HTML `loading="lazy"` attribute can help.

2. **Responsive Images**:
   - Use the `srcset` attribute to serve different image sizes for different devices.
   - Example:
     ```html
     <img src="small.jpg" srcset="medium.jpg 768w, large.jpg 1200w" sizes="(max-width: 600px) 480px, (max-width: 1200px) 800px, 1200px" alt="Example image">
     ```

3. **Caching**:
   - Implement caching strategies for assets using HTTP headers (e.g., Cache-Control, ETag).
   - Ensure that your CDN and web server are configured to leverage caching effectively.

4. **Prefetching and Preloading**:
   - Use `<link rel="prefetch">` and `<link rel="preload">` to load assets in advance that will be needed soon.
   - Example:
     ```html
     <link rel="preload" href="sprite.jpg" as="image">
     ```

### Example Implementation:
Here's an example of how you can handle sprite uploads and storage using AWS S3 and serve them efficiently:

#### Backend (Node.js + Prisma):
1. **Install AWS SDK**:
   ```bash
   npm install aws-sdk
   ```

2. **Configure AWS S3**:
   ```javascript
   const AWS = require('aws-sdk');
   const s3 = new AWS.S3({
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
     region: process.env.AWS_REGION,
   });

   async function uploadSpriteToS3(file) {
     const params = {
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: `sprites/${file.originalname}`,
       Body: file.buffer,
       ContentType: file.mimetype,
     };
     const data = await s3.upload(params).promise();
     return data.Location; // Returns the URL of the uploaded sprite
   }
   ```

3. **GraphQL Resolver for Sprite Upload**:
   ```javascript
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   const { uploadSpriteToS3 } = require('./s3Upload');

   export const resolvers = {
     Mutation: {
       createSprite: async (_, { pokemonId, file, description, context }) => {
         const url = await uploadSpriteToS3(file);
         return prisma.sprite.create({
           data: {
             url,
             description,
             context,
             pokemonId,
           },
         });
       },
     },
   };
   ```

#### Frontend:
1. **Fetching and Displaying Sprites**:
   - Fetch the sprite URLs from your GraphQL API.
   - Use responsive images and lazy loading for performance.

   ```javascript
   import React, { useState, useEffect } from 'react';

   const PokemonSprites = ({ pokemonId }) => {
     const [sprites, setSprites] = useState([]);

     useEffect(() => {
       async function fetchSprites() {
         const response = await fetch(`/api/pokemon/${pokemonId}/sprites`);
         const data = await response.json();
         setSprites(data);
       }
       fetchSprites();
     }, [pokemonId]);

     return (
       <div>
         {sprites.map(sprite => (
           <img key={sprite.id} src={sprite.url} alt={sprite.description} loading="lazy" />
         ))}
       </div>
     );
   };

   export default PokemonSprites;
   ```

2. **Using a CDN**:
   Ensure your sprites are served from a CDN by configuring your storage service (e.g., AWS S3 with CloudFront).

### Conclusion:
By following these steps, you can effectively manage and serve sprites for Pokémon, ensuring a performant and scalable solution. Using cloud storage, CDNs, image optimization, and frontend performance techniques will provide a smooth experience for your users.

For a pet project where you want to minimize costs, you can still achieve efficient asset storage and delivery using free or low-cost services. Here are some alternatives:

### Free Storage and Hosting Options

1. **GitHub Pages**:
   - Host your static assets (like images and sprites) on GitHub Pages.
   - You can create a separate repository or use an existing one to store your assets.

2. **Netlify**:
   - Netlify offers free plans that include hosting static files.
   - You can deploy your static assets to Netlify and use its CDN for fast delivery.

3. **Firebase Storage**:
   - Firebase offers a free tier with a generous amount of storage and bandwidth.
   - You can store your sprites in Firebase Storage and access them via a URL.

4. **Cloudinary**:
   - Cloudinary offers a free tier with a decent amount of storage and bandwidth for image hosting and transformation.
   - It also provides optimizations like automatic resizing and format conversions.

### Implementing with Firebase Storage

1. **Set Up Firebase**:
   - Create a Firebase project at https://firebase.google.com/.
   - Add Firebase to your web app and install the Firebase SDK.

   ```bash
   npm install firebase
   ```

2. **Configure Firebase Storage**:
   ```javascript
   // firebaseConfig.js
   import firebase from 'firebase/app';
   import 'firebase/storage';

   const firebaseConfig = {
     apiKey: process.env.FIREBASE_API_KEY,
     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
     projectId: process.env.FIREBASE_PROJECT_ID,
     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.FIREBASE_APP_ID,
   };

   firebase.initializeApp(firebaseConfig);
   const storage = firebase.storage();

   export { storage };
   ```

3. **Upload Sprite to Firebase Storage**:
   - Create a function to upload a sprite to Firebase Storage and get the download URL.

   ```javascript
   // uploadSprite.js
   import { storage } from './firebaseConfig';

   async function uploadSpriteToFirebase(file) {
     const storageRef = storage.ref();
     const spriteRef = storageRef.child(`sprites/${file.name}`);
     await spriteRef.put(file);
     const url = await spriteRef.getDownloadURL();
     return url;
   }

   export { uploadSpriteToFirebase };
   ```

4. **GraphQL Resolver for Sprite Upload**:
   ```javascript
   import { PrismaClient } from '@prisma/client';
   import { uploadSpriteToFirebase } from './uploadSprite';

   const prisma = new PrismaClient();

   export const resolvers = {
     Mutation: {
       createSprite: async (_, { pokemonId, file, description, context }) => {
         const url = await uploadSpriteToFirebase(file);
         return prisma.sprite.create({
           data: {
             url,
             description,
             context,
             pokemonId,
           },
         });
       },
     },
   };
   ```

5. **Frontend Implementation**:
   - Use the previously mentioned approach to fetch and display sprites.
   - Ensure you fetch the sprite URLs from your GraphQL API and use responsive images and lazy loading.

### Using GitHub Pages or Netlify for Static Assets

1. **GitHub Pages**:
   - Create a repository on GitHub to store your assets.
   - Enable GitHub Pages for the repository.

   ```bash
   # Clone your repository
   git clone https://github.com/your-username/your-repo.git
   cd your-repo

   # Add your sprites to the repository
   cp /path/to/your/sprites/* .

   # Commit and push changes
   git add .
   git commit -m "Add sprites"
   git push origin main
   ```

   - Access your sprites at `https://your-username.github.io/your-repo/sprite-name.png`.

2. **Netlify**:
   - Create a new site on Netlify and link it to your GitHub repository.
   - Deploy your repository to Netlify.
   - Access your sprites via the Netlify URL.

### Conclusion

By using free services like GitHub Pages, Netlify, Firebase Storage, or Cloudinary, you can efficiently store and serve your sprites without incurring costs. These solutions offer a good balance of performance and cost-efficiency for a pet project.