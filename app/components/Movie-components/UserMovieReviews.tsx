import { findAllUsers } from "@/app/collection/connection";

const UserMovieReviews = async ({ movieId }: { movieId: Number }) => {
  const allUsers = await findAllUsers();
  //Since the movie reviews are all inside the users and there is no collection for the movies
  //what we do is that we make a new array of users with only the users that have made a review using flatmap
  ///and then we filter the array to only get the reviews that match the movieId
  const reviewsForMovie = allUsers
    .flatMap((user: any) =>
      (user.user_movie_reviews || []).map((review: any) => ({
        ...review,
        username: user.username || user.name,
      }))
    )
    .filter((review: any) => review.movieId === movieId)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return (
    <>
      {reviewsForMovie && reviewsForMovie.length > 0 ? (
        <div className="border border-gray-300 shadow-gray-600 p-4 rounded-md shadow-md w-80 h-64 md:w-48 md:h-96 lg:h-96 lg:w-72 overflow-auto">
          {reviewsForMovie.map((review: any) => {
            return (
              <div key={review.reviewId} className="my-2 p-2">
                <div className="flex gap-2 md:gap-6">
                  <span className="font-semibold w-1/2">{review.date}</span>
                  <span className="font-semibold w-1/2">{review.username}</span>
                </div>

                <div className="w-full mt-1 overflow-hidden text-ellipsis whitespace-normal break-words">
                  <span className="text-sm">{review.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="my-4 mb-10 flex w-full justify-center items-center">
          <span className="bg-neutral-600 sm:text-lg text-md text-slate-200 z-20 py-3 px-6 rounded-lg">
            No reviews at this moment.
          </span>
        </div>
      )}
    </>
  );
};
export default UserMovieReviews;
