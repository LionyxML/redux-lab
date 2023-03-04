import { from, Subject } from "rxjs";
import {
  bufferTime as bufferTime$,
  filter as filter$,
  map as map$,
  mergeMap as mergeMap$,
} from "rxjs/operators";

const batchRequestsMiddleware = (store) => {
  const actions$ = new Subject();

  actions$
    .asObservable()
    .pipe(
      filter$(({ type }) => type === "REQUEST_DATA_BATCHED"),
      bufferTime$(5_000),
      filter$((requests) => requests.length > 0),
      map$((requests) =>
        from(
          Promise.all(
            requests.map(({ payload: { url, key } }) =>
              fetch(url)
                .then((res) => res.json())
                .then((data) => ({ [key]: data.name }))
            )
          )
        )
      ),
      mergeMap$((dataObservable) => dataObservable)
    )
    .subscribe((data) => {
      const formattedToStore = data.reduce((acc, curr) => {
        const [key, value] = Object.entries(curr)[0];
        acc[key] = value;
        return acc;
      }, {});

      store.dispatch({
        type: "BATCHED_REQUEST_SUCCESS",
        payload: { data: formattedToStore },
      });
    });

  return (next) => (action) => {
    if (action.type !== "REQUEST_DATA_BATCHED") {
      return next(action);
    }

    actions$.next(action);

    return null;
  };
};

export default batchRequestsMiddleware;
