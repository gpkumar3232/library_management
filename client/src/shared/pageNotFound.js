// Functional component to display a "Page Not Found" message
function PageNotFound() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <img src={require('../assets/404-page-not-found.jpeg')} alt={'Page Not Found'} height={500} width={500} style={{ objectFit: 'cover' }} />
        </div>
    )
}
export default PageNotFound;