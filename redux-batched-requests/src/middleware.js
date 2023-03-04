import { from, of } from "rxjs";
import { filter, bufferTime, mergeMap, map } from "rxjs/operators";

const BATCH_DELAY = 5_000;
let pendingActions = [];

// Processes the batch of actions and dispatch the result
const processBatch = (batchedActions, store) => {
  const requests = batchedActions.map((action) => ({
    key: action.payload.key,
    url: action.payload.url,
  }));

  // This uses RxJS to make the batched requests and combine the results
  const batchedRequests$ = from(requests).pipe(
    mergeMap(({ url, key }) =>
      from(fetch(`${url}`)).pipe(
        mergeMap((response) => response.json()),
        map((data) => ({ ...data, key }))
      )
    ),
    bufferTime(BATCH_DELAY),
    filter((results) => results.length > 0), // Filter empty results
    map(
      (results) =>
        results.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.name }), {}) // Only names for now
    ) // Merge results into a single object with id keys
  );

  // Dispatches the result of the batched requests to the store
  batchedRequests$.subscribe((data) => {
    store.dispatch({ type: "BATCHED_REQUEST_SUCCESS", payload: { data } });
  });
};

const batchMiddleware = (store) => (next) => (action) => {
  // Checks if the action should be batched
  if (action.type === "REQUEST_DATA_BATCHED") {
    pendingActions.push(action);

    // Waits for the specified delay before processing the batch
    setTimeout(() => {
      processBatch(pendingActions, store);
      pendingActions = [];
    }, BATCH_DELAY);

    return of({ type: "REQUEST_BATCHED" });
  }

  // Forwards the action if it's not a batched request
  return next(action);
};

export default batchMiddleware;
