export default (
	/** @type {import('plop').NodePlopAPI} */
	plop,
) => {
	plop.setGenerator("use-case", {
		description: "Gerar um novo use-case e seu teste.",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Qual é o nome do use-case?",
			},
		],
		actions: [
			{
				type: "add",
				path: "src/use-cases/{{kebabCase name}}.ts",
				templateFile: "templates/use-case.hbs",
			},
			{
				type: "add",
				path: "src/use-cases/{{kebabCase name}}.spec.ts",
				templateFile: "templates/use-case.spec.hbs",
			},
		],
	});
};
