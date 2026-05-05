import { buildSchema } from "graphql";
import { prisma } from "../config/prisma.js";

export const schema = buildSchema(`
  enum ProjectType {
    SOLAR
    GRID
    HYBRID
  }

  type Project {
    id: String!
    name: String!
    location: String!
    capacityKwh: Float!
    pricePerUnit: Float!
    type: ProjectType!
    isActive: Boolean!
    createdAt: String!
  }

  type Query {
    projects: [Project!]!
    project(id: String!): Project
  }
`);

export const root = {
  projects: async () => {
    return prisma.project.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  },
  project: async ({ id }) => {
    return prisma.project.findUnique({ where: { id } });
  },
};
