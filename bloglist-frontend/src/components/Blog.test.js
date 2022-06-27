import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import Blog from "./Blog";

describe("renders blog", () => {
  let component;
  const mockOnClickLikeHandler = jest.fn();

  const blog = {
    title: "mytitle5",
    author: "ben",
    url: "aa.co",
    likes: 6,
    user: {
      username: "ben",
      name: "ben",
      id: "62849db4850becea9efd72cd",
    },
    id: "62860673ed1669cba6c22679",
  };

  beforeEach(() => {
    component = render(
      <Blog blog={blog} onClickLike={mockOnClickLikeHandler} />
    );
  });

  test("default show title and author", () => {
    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).toHaveTextContent(blog.author);

    const div = component.container.querySelector(".blogDetail");
    expect(div).toHaveStyle("display: none");
  });

  test("show blog detail and check likes", () => {
    const button = component.container.querySelector(".viewAll");
    fireEvent.click(button);

    const div = component.container.querySelector(".blogDetail");
    expect(div).not.toHaveStyle("display: none");

    const divUrl = component.container.querySelector(".blogUrl");
    expect(divUrl).toHaveTextContent(blog.url);

    const divLikes = component.container.querySelector(".blogLikes");
    expect(divLikes).toHaveTextContent(blog.likes);
  });

  test("click likes twice", () => {
    const buttonViewAll = component.container.querySelector(".viewAll");
    fireEvent.click(buttonViewAll);

    const div = component.container.querySelector(".blogDetail");
    expect(div).not.toHaveStyle("display: none");

    const buttonLikes = component.container.querySelector(".btnLikes");
    fireEvent.click(buttonLikes);
    fireEvent.click(buttonLikes);

    expect(mockOnClickLikeHandler.mock.calls).toHaveLength(2);
  });
});
