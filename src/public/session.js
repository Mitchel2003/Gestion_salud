const container = document.querySelector('.card');
container.addEventListener('submit', async function (event) {
    event.preventDefault();
    await (await import('../components/firebase/query.js')).offSession();
});