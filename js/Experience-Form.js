export function Exp_FormData(){
    const container = document.getElementById('experienceContainer');

    // Create a new experience input group
    const expDiv = document.createElement('div');
    expDiv.classList.add('flex', 'flex-col', 'space-y-2', 'p-3', 'rounded-lg', 'bg-gray-200' , 'exp-form');

    expDiv.innerHTML = `
        <input type="text" name="experience_title[]" placeholder="Titre du poste"
            class="exp-title w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="experience_company[]" placeholder="Entreprise"
            class="exp-company w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text" name="experience_duration[]" placeholder="Durée (Ex: 2020-2022)"
            class="exp-year w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <textarea name="experience_description[]" placeholder="Description"
            class="exp-description w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        <button type="button" class="remove-exp  py-1 bg-red-500 text-white rounded hover:bg-red-600">Remove</button>
    `;

    container.appendChild(expDiv);

    // Add event listener to remove button
    expDiv.querySelector('.remove-exp').addEventListener('click', function () {
        container.removeChild(expDiv);
    })
}