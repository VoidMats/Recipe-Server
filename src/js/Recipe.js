

export class Recipe {

    constructor(client, containerId) {
        this._client = client;
        this._containerId = containerId;
    }
    
    /**
     * Create the following html structure
     * <div id="recipe-content" class="content">
     *      <h2 class="content-subhead">Recipe</h2>
     *      <div class="grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
                <input readonly value="Title" />
                <input readonly value="Time" />
                <input readonly value="Servings" />
                <input readonly value="Keywords" />
            </div>
            <div class="grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0;">
                <img src="/public/test.png" alt="Recipe image"/>
                <textarea readonly>Some descirpion</textarea>
            </div>
            <div class="grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0;">
                <div>
                <h5 style="padding-top: 20px;">Ingredients</h4>
                <ul>
                    <li>First ingredient</li>
                    <li>Second ingredient</li>
                </ul>
                </div>
                <div>
                <h5 style="padding-top: 20px;">Instruction</h4>
                <ol>
                    <li>First instruction</li>
                    <li>Second instruction</li>
                    <li>Third instruction</li>
                </ol>
                </div>
            </div>
        </div>
     * @param { String } recipeId 
     */
    async addRecipeToPage(recipeId) {
        // Hide all pages
        this._client.__pages.forEach((id) => {
            const div = document.getElementById(`${id}-content`);
            div.hidden = true;
        });

        // Get recipe 
        const url = this._client._api.createUrl(`/recipe/${recipeId}`);
        const response = await this._client._api.fetch("GET", url);
        if (response.success) {
            console.log(response.result);
            const recipe = response.result;

            // Get container element
            const root = document.getElementById(this._containerId);
            root.hidden = false;

            const header = document.createElement('h2');
            header.className = 'content-subhead';
            header.textContent = 'Recipe';

            const grid1 = document.createElement('div');
            grid1.className = 'grid';
            grid1.style.display = 'grid';
            grid1.style.gridTemplateColumns = 'repeat(4, 1fr)';
            grid1.style.gap = '1rem';

            const inputs = [recipe.title, recipe.time, recipe.servings, recipe.keywords];
            inputs.forEach((context) => {
                const input = document.createElement('input');
                input.readOnly = true;
                input.value = context;
                grid1.appendChild(input);
            });

            const grid2 = document.createElement('div');
            grid2.className = 'grid';
            grid2.style.display = 'grid';
            grid2.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid2.style.gap = '0';

            const img = document.createElement('img');
            img.src = '/public/test.png';
            img.alt = 'Recipe image';
            img.style.height = '100%';

            const descriptionTextarea = document.createElement('textarea');
            descriptionTextarea.readOnly = true;
            descriptionTextarea.textContent = recipe.description;
            descriptionTextarea.style.height = '100%';

            grid2.appendChild(img);
            grid2.appendChild(descriptionTextarea);

            const grid3 = document.createElement('div');
            grid3.className = 'grid';
            grid3.style.display = 'grid';
            grid3.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid3.style.gap = '0';

            // Create the ingredient div
            const ingDiv = document.createElement('div');

            const ingH5 = document.createElement('h5');
            ingH5.style.paddingTop = '20px';
            ingH5.textContent = 'Ingredients';
            ingDiv.appendChild(ingH5);

            for (const component of recipe.components) {
                const ingHeader = document.createElement("p");
                ingHeader.textContent = component.name;
                ingDiv.appendChild(ingHeader);
                
                const ingList = document.createElement('ul');
                for (const item of component.ingredients) {
                    const li = document.createElement('li');
                    li.textContent = `${item.size} ${item.unit}${(item.size) ? " - " : ""}${item.ingredient}`;
                    li.style.fontFamily = 'inherit';
                    ingList.appendChild(li);
                }
                ingDiv.appendChild(ingList);
            }

            // Create the instruction div
            const insDiv = document.createElement('div');

            const insH5 = document.createElement('h5');
            insH5.style.paddingTop = '20px';
            insH5.textContent = 'Instruction';
            insDiv.appendChild(insH5);

            for (const instruction of recipe.instructions) {
                const insHeader = document.createElement("p");
                insHeader.textContent = instruction.name;
                insDiv.appendChild(insHeader);

                const insList = document.createElement('ol');
                for (const item of instruction.step) {
                    const li = document.createElement('li');
                    li.textContent = item;
                    li.style.fontFamily = 'inherit';
                    insList.appendChild(li);
                }
                insDiv.appendChild(insList);
            }

            grid3.appendChild(ingDiv);
            grid3.appendChild(insDiv);

            // Append all elements
            root.appendChild(header);
            root.appendChild(grid1);
            root.appendChild(grid2);
            root.appendChild(grid3);
        }
    }

    removeRecipeFromPage() {
        // Get container element
        const root = document.getElementById(this._containerId);
        root.textContent = "";
        root.hidden = true;
    }
}

export class RecipeDelete extends Recipe {
    
    constructor(containerId) {
        super(containerId);
    }


}