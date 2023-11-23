export function requireAssets(url){

    return new URL(`../assets/images/${url}`,import.meta.url).href
}