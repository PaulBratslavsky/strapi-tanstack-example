import { Link, createFileRoute } from "@tanstack/react-router";
import { fetchPost } from "../utils/posts";
import { PostErrorComponent } from "./posts.$postId";
import { getStrapiMedia } from "~/utils/strapi";
import { MarkdownText } from "~/components/MarkdownText";

function BlockRenderer(blocks: any) {
  return blocks.map((block: any, index: number) => {
    return <MarkdownText key={index} content={block.body} />;
  });
}

export const Route = createFileRoute("/posts_/$postId/deep")({
  loader: async ({ params: { postId } }) =>
    fetchPost({
      data: postId,
    }),
  errorComponent: PostErrorComponent,
  component: PostDeepComponent,
});

function PostDeepComponent() {
  const post = Route.useLoaderData();
  const coverUrl = getStrapiMedia(post.cover.url);

  console.log(post);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Link
        to="/posts"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span className="mr-2">←</span>Back to Posts
      </Link>

      {post.cover && (
        <div className="aspect-video relative overflow-hidden rounded-lg shadow-lg">
          <img
            src={coverUrl ?? undefined}
            alt={post.cover.alternativeText}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <article className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.updatedAt !== post.publishedAt && (
            <span>
              (Updated: {new Date(post.updatedAt).toLocaleDateString()})
            </span>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed">{post.description}</p>
        {BlockRenderer(post.blocks)}
      </article>
    </div>
  );
}
