import { findAllUsers } from "@/app/User Collection/connection";

const UserMovieReviews = async ({ movieId }: { movieId: Number }) => {
  const allUsers = await findAllUsers();
  //Since the movie reviews are all inside the users and there is no collection for the movies
  //what we do is that we make a new array of users with only the users that have made a review using flatmap
  //and then we filter the array to only get the reviews that match the movieId
  //We then sort it based on the date
  const reviewsForMovie = allUsers
    .flatMap(
      (user: any) =>
        (user.user_movie_reviews || []).map((review: any) => ({
          ...review,
          username: user.username || user.name,
        })) //We want to be able to also display the username of the user who made the review
    )
    .filter((review: any) => review.movieId === movieId)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return (
    <>
      {reviewsForMovie && reviewsForMovie.length > 0 ? (
        <div className="border border-gray-300 shadow-gray-600 text-slate-900 bg-[#5d676f] p-4 rounded-lg shadow-md w-80 h-64 md:w-60 md:h-96 lg:h-96 lg:w-72 overflow-auto user-review-container">
          {reviewsForMovie.map((review: any) => {
            return (
              <div
                key={review.reviewId}
                className="my-2 p-4 rounded-lg shadow-md border border-gray-400 bg-slate-300 user-review-text-container"
              >
                <div className="flex justify-between gap-2 md:gap-6 mb-1">
                  <span className="text-xs font-semibold user-review-date">
                    {new Date(review.date).toLocaleString()}
                  </span>{" "}
                  {/*The date is converted based on the user's location */}
                  <span className="text-xs font-semibold max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">
                    {review.username}
                  </span>
                </div>

                <div className="w-full mt-1 overflow-hidden text-ellipsis whitespace-normal break-words">
                  <span className="text-sm">{review.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-gray-300 shadow-gray-600 text-slate-100 bg-[#5d676f] p-4 rounded-lg shadow-md w-80 md:w-60 lg:w-72 overflow-auto user-review-container">
          <span className="">No reviews at this moment.</span>
        </div>
      )}
    </>
  );
};
export default UserMovieReviews;
