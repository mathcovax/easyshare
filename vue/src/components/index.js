const components = [

];


export default {
	install(vue){
		for(const component of components){
			vue.component(component.name, component);
		}
	}
};
