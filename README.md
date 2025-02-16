# Recipe API React Native App

This React Native application implements CRUD operations (Create, Read, Update, Delete) using the Recipe API. The app is designed to interact with the Recipe API for managing recipe data, including retrieving, adding, updating, and deleting recipes. The project is intended to help familiarize you with API usage in React Native applications.



## Installation

*Scan the QR Code to install the app.*
  ![number 1](./assets/images//code.png)

To get started with this project, follow the steps below:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/09Jeanette/my-recipe-box.git
   ```
1.2 **Navigate to your project directory**
```bash
cd mobile-recipe-app
```


2. **Checkout to the dev branch**:
   ```bash
   git checkout dev
   ```

3. **Install Dependencies**
  ```bash
   npm i
   ```

4. **Run the application**
  ```bash
   npx expo start
   ```

# Recipe App API Integration

## Endpoints

This application interacts with the Recipe API. Below are the key endpoints used:

**Base URL:**  
`https://recipe-app-api-yfor.onrender.com`

### Get Recipes:
`GET /api/v1/recipes`  
Retrieves a list of all recipes.

### Create Recipe:
`POST /api/v1/recipes`  
Creates a new recipe.

### Update Recipe:
`PUT /api/v1/recipes/:id`  
Updates a specific recipe by ID.

### Delete Recipe:
`DELETE /api/v1/recipes/:id`  
Deletes a recipe by ID.

## Authentication

This API requires authentication via a Bearer Token in the request header. The token is retrieved after the user logs in and is stored using AsyncStorage for later use. If the user is not authenticated, the app will display a message prompting the user to log in.

## Error Handling

The app handles errors gracefully using `try-catch` blocks. If an error occurs during any API call (e.g., failed network request, invalid token), the user will be notified with an appropriate error message. This helps improve the user experience by providing feedback in case of failure.

## Functionality

### Create Recipe

Users can create new recipes by filling out a form with recipe details (name, ingredients, servings, prep time, cooking time, instructions). The app sends a `POST` request to the Recipe API to add the new recipe.

### Read Recipe

The app displays a list of recipes fetched from the API. Each recipe is shown with its name, ingredients, and other details. The app sends a `GET` request to retrieve all recipes.

### Update Recipe

Users can update an existing recipe by clicking the 'Update' button. The app fetches the current details of the recipe, populates them into a form, and allows the user to edit and submit the updated recipe. A `PUT` request is sent to the API to update the recipe.

### Delete Recipe

Users can delete a recipe from the app by pressing the 'Delete' button next to the recipe. The app sends a `DELETE` request to the API to remove the recipe.

## Testing

Before testing, ensure the API is running and accessible.

### Manual Testing:

- Use Postman or `curl` to manually test each endpoint.
- Verify that the `GET` endpoint returns the list of recipes.
- Test the `POST`, `PUT`, and `DELETE` operations by sending valid and invalid data.

### Automated Testing:

Automated testing for API calls can be implemented using Jest for unit tests on API requests and response handling.

## UI/UX Design

The app provides a user-friendly interface for managing recipes. Key features include:

- **Forms** for creating and updating recipes with input fields for ingredients, cooking time, etc.
- **Recipe List View** where users can see all recipes.
- **Buttons** for updating or deleting recipes with clear feedback messages upon success or failure.
- **Status Messages** displayed at the top to notify users of errors or success messages.
- The design is responsive, ensuring a smooth experience on both Android and iOS platforms.

## Dependencies

- **React Native** — For building the mobile app.
- **AsyncStorage** — For storing the authentication token.
- **Fetch API** — For making API requests.
- **React Navigation** — For handling screen navigation.


