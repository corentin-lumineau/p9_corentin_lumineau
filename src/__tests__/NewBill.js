/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When I select a new file ", () => {
      test("I should see the name of the file", () => {


        window.$ = jest.fn().mockImplementation(() => {
          return {
            split: jest.fn(), 
            click: jest.fn(),
           }
       });

        Object.defineProperty(window, "localStorage", { value : localStorageMock })

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "employee"
          })
        );

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        const html = NewBillUI();
        document.body.innerHTML = html;

        const input = screen.getByTestId("file");
       
        const myNewBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage : window.localStorage,
        })
        
        const handleChangeFile = jest.fn( (e) => {
          myNewBill.handleChangeFile(e);
        })
        input.addEventListener("change", (e) => handleChangeFile(e))
        fireEvent.change(input); 
        expect(handleChangeFile).toHaveBeenCalled();
      })
    })

    describe("When I click on submit button", () => {
      test("The new bill should be posted and the user is redirected to bills page", async () => {

        Object.defineProperty(window, "localStorage", { value : localStorageMock })

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "employee",
            email: "john@gmail.com"
          })
        );

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }

        const html = NewBillUI();
        document.body.innerHTML = html;

        const form = screen.getByTestId("form-new-bill");
       
        const myNewBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage : window.localStorage,
        })
      

        const handleSubmit = jest.fn( (e) => {
          myNewBill.handleSubmit(e);
        });

        
        //Fake value in form
        const fileTest = new File(["test"], "test.png", {type: "image/png"})

        document.querySelector(`select[data-testid="expense-type"]`).value = "Transports";
        document.querySelector(`input[data-testid="expense-name"]`).value = "test";
        document.querySelector(`input[data-testid="amount"]`).value = 234;
        document.querySelector(`input[data-testid="datepicker"]`).value = "2022-08-26";
        document.querySelector(`input[data-testid="vat"]`).value = "3";
        document.querySelector(`input[data-testid="pct"]`).value = 2;
        document.querySelector(`textarea[data-testid="commentary"]`).value = "This is my post test";
        //Renvoie undefined en front
        myNewBill.fileUrl = undefined;
        myNewBill.fileName = fileTest.fileName;
        status = 'pending';
      


        form.addEventListener("submit", (e) => handleSubmit(e));
        fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalled();
        expect(screen.getByTestId('tbody')).toBeTruthy();
        const allBills = screen.getAllByTestId("bill-line");
        expect(allBills.length).toEqual(1);

      })
    })
  })
})
