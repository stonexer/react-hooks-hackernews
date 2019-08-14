import { createFetch } from 'yab-fetch';
import { createLogger } from 'yab-fetch-logger';

export interface Story {
  id: number;
  rank: number;
  title: string;
  by: string;
  url: string;
  kids: [];
}

export interface Comment {
  id: number;
  by: string;
  text: string;
}

export const yab = createFetch({
  baseURL: '//hacker-news.firebaseio.com/v0'
});

yab.use(createLogger());

const hnParams = { print: 'pretty' };

export const fetchHackerNews = async (count: number): Promise<Story[]> => {
  const ids = await yab.get<number[]>('topstories.json', {
    params: {
      print: 'pretty'
    }
  });

  const storyIds = ids.slice(0, count);

  const stories = await Promise.all(
    storyIds.map((id: number, index: number) => {
      return yab
        .get<Story>(`item/${id}.json`, {
          params: hnParams
        })
        .then((story) => {
          story.rank = index + 1;

          return story;
        });
    })
  );

  return stories;
};

export const fetchHackerNewsComments = async (
  commentIds: number[]
): Promise<Comment[]> => {
  return Promise.all(
    commentIds.map((commentId) =>
      yab.get<Comment>(`item/${commentId}.json?print=pretty`, {
        params: hnParams
      })
    )
  ).then((comments) => comments.filter(Boolean));
};

export const filterStories = (
  stories: Story[],
  filterText: string
): Story[] => {
  const loweredFilterText = filterText.toLowerCase();
  return stories.filter(
    (story) =>
      !loweredFilterText ||
      story.title.toLowerCase().indexOf(loweredFilterText) !== -1 ||
      story.by.toLowerCase().indexOf(loweredFilterText) !== -1
  );
};
