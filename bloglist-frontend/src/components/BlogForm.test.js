import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import BlogForm from "./BlogForm";

test("create a new blog", () => {
  const mockCreateBlogHandler = jest.fn();

  const blog = {
    title: "mytitle6",
    author: "ben",
    url: "example.org",
  };

  const component = render(
    <BlogForm requestCreateBlog={mockCreateBlogHandler} />
  );

  const inputTitle = component.container.querySelector("#inputTitle");
  const inputAuthor = component.container.querySelector("#inputAuthor");
  const inputUrl = component.container.querySelector("#inputUrl");
  const form = component.container.querySelector("form");

  fireEvent.change(inputTitle, {
    target: { value: blog.title },
  });

  fireEvent.change(inputAuthor, {
    target: { value: blog.author },
  });

  fireEvent.change(inputUrl, {
    target: { value: blog.url },
  });

  fireEvent.submit(form);

  expect(mockCreateBlogHandler.mock.calls).toHaveLength(1);
  expect(mockCreateBlogHandler.mock.calls[0][0]).toEqual(blog);
});
