import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);

  // add regular task with due date
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const submitButton = screen.getByRole('button', { name: /Add/i }); 
  fireEvent.change(inputTask, { target: { value: "first task" } });
  fireEvent.change(inputDate, { target: { value: "06/24/2024" } });
  fireEvent.click(submitButton);

  expect(screen.getByText(/first task/i)).toBeInTheDocument();

  // add the duplicate due date check for one
  fireEvent.change(inputTask, { target: { value: "first task" } });
  fireEvent.change(inputDate, { target: { value: "06/24/2024" } });
  fireEvent.click(submitButton);
  expect(screen.getAllByText(/first task/i).length).toBe(1);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  // add regular task with due date
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const submitButton = screen.getByRole('button', { name: /Add/i }); 
  fireEvent.change(inputDate, { target: { value: "06/24/2024" } });
  fireEvent.click(submitButton);

  const checkTask = screen.queryByText(new RegExp("06/24/2024", "i"));
  expect(checkTask).not.toBeInTheDocument();
  
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const submitButton = screen.getByRole('button', { name: /Add/i }); 
  fireEvent.change(inputTask, { target: { value: "first task" } });
  fireEvent.click(submitButton);

  expect(screen.queryByText(new RegExp("first task", "i"))).not.toBeInTheDocument();
  
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
   const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
   const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
   const submitButton = screen.getByRole('button', {name: /Add/i});
   fireEvent.change(inputTask, { target: { value: "first task"}});
   fireEvent.change(inputDate, { target: { value: "06/24/2024"}});
   fireEvent.click(submitButton);
 
   expect(screen.getByText(/first task/i)).toBeInTheDocument();
 
   const deleteTask = screen.getByRole("checkbox");
   fireEvent.click(deleteTask);
 
   expect(screen.queryByText(/first task/i)).not.toBeInTheDocument();
   expect(screen.queryByText(new RegExp("06/24/2024", "i"))).not.toBeInTheDocument();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const submitButton = screen.getByRole('button', {name: /Add/i});
  
  fireEvent.change(inputTask, { target: { value: "first task"}});
  fireEvent.change(inputDate, { target: { value: "06/24/2025"}});
  fireEvent.click(submitButton);

  fireEvent.change(inputTask, { target: { value: "prev task"}});
  fireEvent.change(inputDate, { target: { value: "06/24/2023"}});
  fireEvent.click(submitButton);

  const firstColor = screen.getByTestId(/first task/i).style.backgroundColor;
  const prevColor = screen.getByTestId(/prev task/i).style.backgroundColor;
  expect(firstColor).not.toBe(prevColor);
 });
