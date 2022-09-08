/**
 * @jest-environment jsdom
 */


import {screen, waitFor, toHaveClass} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

jest.mock("../app/store", () => mockStore);


describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);

    }) 
     test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  
  describe("When I click on icon-eye", () => {
    test("A modal should open", async () => {

      window.$ = jest.fn().mockImplementation(() => {
        return {
          modal: jest.fn(),
          click: jest.fn(),
          width: jest.fn(),
         }
     });

    
     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "employee",
        })
      );

      document.body.innerHTML = BillsUI({ data: bills });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      };

      const store = null;

      const myBills = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const eye = screen.getAllByTestId("icon-eye")[0];
      

     const handleClickIconEye = jest.fn((eye) => {
        myBills.handleClickIconEye(eye);
     })

      eye.addEventListener("click", handleClickIconEye(eye)) 
      userEvent.click(eye);
      expect(handleClickIconEye).toHaveBeenCalled();
      await waitFor(() => screen.getByText("Justificatif"))
      expect(screen.getByText('Justificatif')).toBeTruthy();
    }) 
  })

  describe("When I click on new bills", () => {
    test("I should navigate on New Bill Page", () => {
    
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "employee"
        })
      );

      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }

      const store = null;

      const myBills = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const newBillButton = screen.getByTestId("btn-new-bill");

      const handleClickNewBill = jest.fn(() => {
        myBills.handleClickNewBill();
      })

      newBillButton.addEventListener("click", handleClickNewBill);
      userEvent.click(newBillButton);
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    }) 
  }) 

  describe("When I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      expect(screen.getByTestId("tbody")).toBeTruthy();
    })
  })
  describe("When an error occurs on API", () => {
    test("Fetches Bills and an error 404 occurs", async () => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("Fetches Bills API and an error 500 occurs", async () => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
