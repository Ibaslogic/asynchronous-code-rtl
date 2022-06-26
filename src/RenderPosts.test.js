import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import RenderPosts from "./RenderPosts";

// msw
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/posts", (req, res, ctx) =>
    res(ctx.json([{ id: 1, title: "title 1" }]))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should render loading message", () => {
  render(<RenderPosts />);
  const loadingText = screen.getByText("A moment please...");
  expect(loadingText).toBeInTheDocument();
});

/* ==========================================
 Using waitFor 
 =====================================*/

test("should fetch and display asynchronous posts", async () => {
  render(<RenderPosts />);
  // screen.debug(); text initially not present
  await waitFor(() => expect(screen.getByText("title 1")).toBeInTheDocument());
  // screen.debug(); text is present
});

test("handles server error", async () => {
  server.use(
    // override the initial "GET /url" request handler
    // to return a 500 Server Error
    rest.get("https://jsonplaceholder.typicode.com/posts", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );
  render(<RenderPosts />);
  // screen.debug(); error message initially not present
  await waitFor(() =>
    expect(
      screen.getByText(/problem fetching the post data/i)
    ).toBeInTheDocument()
  );
  // screen.debug(); error message is present
});

test("Should wait for loading message to remove when posts arive: using waitFor", async () => {
  render(<RenderPosts />);

  await waitFor(() => {
    const loadingText = screen.queryByText("A moment please...");
    expect(loadingText).not.toBeInTheDocument();
  });
});

/* ==========================================
 Using waitForElementToBeRemoved 
 =====================================*/

test("Should display loading message and disappear when posts arive", async () => {
  render(<RenderPosts />);
  await waitForElementToBeRemoved(() => screen.getByText("A moment please..."));
});

/* ==========================================
 Using findBy 
 =====================================*/

test("should fetch and display asynchronous posts: using findBy", async () => {
  render(<RenderPosts />);
  // screen.debug(); //text initially not present
  const postItemNode = await screen.findByText("title 1");
  // screen.debug(); //text is present
  expect(postItemNode).toBeInTheDocument();
});
