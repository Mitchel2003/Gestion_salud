const container = document.querySelector('.card');
container.addEventListener('submit', async function (event) {
    event.preventDefault();

    await (await import('../components/firebase/conection.js')).signOut((await import('../components/firebase/conection.js')).auth)
    .then(() => {
        window.location.href = '../../index.html';
    }).catch((error) => {
        console.log(error);
    });
});