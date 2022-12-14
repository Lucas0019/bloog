import Head from "next/head"
import styles from './post.module.scss'
import { hygraph } from "../../graphql/hygraph";
import { GET_POST } from "../../graphql/querys/post";
import { GET_POST_SLUG } from "../../graphql/querys/slug";
import { GetStaticPaths, GetStaticProps } from 'next';
import style from './post.module.scss'
import Link from "next/link";
import { AuthorDatePost } from '../../components/AuthorDatePost/index';
import { IPost } from "../../types/post";

export const Post = ({post}: IPost) => {

  return (
    <>
      <Head>
        <title>Post | Bloog</title>
      </Head>
      <main className={styles?.container}>
        <article className={styles?.post}>
          {post.title && <h1>{post.title}</h1> }
          <AuthorDatePost createdAt={post?.createdAt}/>
          <div>
            <Link href="/" passHref>
              <a className={style.author}>
                { post?.author?.name  && 
                  <p>
                    Por: {post?.author?.name}  
                  </p>
                }
              </a>
            </Link>
          </div>

          {post?.content.html ? (
            <div 
              className={style.contentPost} 
              dangerouslySetInnerHTML={{__html: post?.content?.html}} 
            />
          ) : (
              <p>
                There is no content for this post yet.
              </p>
          )}
          
        </article>
      </main>
    </>
  )
}

export default Post

export const getStaticProps: GetStaticProps = async ({params}) => {
  const slug = params?.slug;

  const data = await hygraph.request(GET_POST, {
    slug: String(slug),
  });

  const post = data?.post;

  return {
    props: {
      post,
    },
    // revalidate: 60 * 60 * 24, // 24 hours
  }
};

export const getStaticPaths: GetStaticPaths = async () => {

  const { posts } = await hygraph.request(GET_POST_SLUG);

  return {
    paths: posts?.map((post: { slug: string; }) => {
      return {
        params: {
          slug: post?.slug,
        },
      };
    }),
    fallback: "blocking"
  };
};