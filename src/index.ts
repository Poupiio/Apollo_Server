import "reflect-metadata";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Arg, buildSchema, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';

// On utilise les décorateurs "ObjectType" et "Field" de type-graphql qui permettent de marquer les données devant etre exposées dans le schéma 
@ObjectType()
class Book {
   @Field()
   id: string
   @Field()
   title: string
   @Field()
   author: string
}

// Classe représentant une entrée utilisateur sur l'ajout d'un livre 
@InputType()
class BookInput {
   @Field()
   title: string;

   @Field()
   author: string;
}

// On peut typer les données grâce au @ObjectType défini plus haut
const books: Book[] = [
   {
      id: "1",
      title: 'The Awakening',
      author: 'Kate Chopin',
   },
   {
      id: "2",
      title: 'City of Glass',
      author: 'Paul Auster',
   },
];

// Resolvers define how to fetch the types defined in your schema.
// Classe contenant nos resolvers
@Resolver(Book)
class BookResolver {

   // Query = lecture de données
   @Query(() => [Book])
   books() {
      return books;
   }

   @Query(() => Book)
   getBookById(@Arg("id") id: string) {
      return books.find((book) => book.id == id);
   }

   // Mutation = écriture de données (modification/suppression)
   @Mutation(() => Book)
   addBook(@Arg("data") { title, author }: BookInput) {
      const lastId = parseInt(books.at(-1).id, 10);
      const id = (lastId + 1).toString();
      books.push({ title, author, id });
      return books.at(-1);
   }

   // @Mutation(() => Book)
   // removeBook(@Arg("id") id: string) {
   //    const bookId = books.find((book) => book.id == id);
   //    return ;
   // }
}

// A schema is a collection of type definitions
// On génère automatiquement le schéma à partir de nos resolvers
const schema = await buildSchema({
   resolvers: [BookResolver],
});
 
const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, {
   listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);