import { z } from "zod";
import { Category } from "../models/commodity";
import { TagCategory } from "../models/tags";


const categoryValues = Object.values(Category) as [string, ...string[]]
const tagValues = Object.values(TagCategory) as [string, ...string[]]


const commoditySchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().gt(0, "Price must be greater than 0"),
  category: z.enum(categoryValues),
  desc: z.string().optional(),
  tags: z.array(z.enum(tagValues)).optional(),
});

export { commoditySchema };
