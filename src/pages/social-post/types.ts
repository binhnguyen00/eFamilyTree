import { SocialPostType } from "./UISocialPosts";

export interface SocialPost {
  id?: number;
  title: string;
  content: string;
  type: SocialPostType;
  creatorId: number;
  creatorName: string;
  thumbnail: string;
  createDate: string;
}