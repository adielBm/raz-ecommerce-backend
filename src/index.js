'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {

    const extensionService = strapi.plugin('graphql').service('extension');

    const { transformArgs } = strapi.plugin("graphql").service("builders").utils;

    const { toEntityResponse } = strapi.plugin("graphql").service('format').returnTypes;


    extensionService.shadowCRUD('api::order.order').disableQueries();


    const extension = ({ nexus }) => ({
      types: [
        nexus.extendType({
          type: "Query",
          definition(t) {
            t.field("orderByCode", {
              type: "OrderEntityResponse",
              args: { code: nexus.stringArg() },
              async resolve(parent, args, ctx) {

                console.log('resolve🔻')

                const transformedArgs = transformArgs(args, {
                  contentType: strapi.contentTypes["api::order.order"],
                  usePagination: false
                });

                console.log('args🟠', args)
                console.log('transformedArgs🟠', transformedArgs)

                const { find } = strapi
                  .plugin("graphql")
                  .service("builders")
                  .get("content-api")
                  .buildQueriesResolvers({
                    contentType:
                      strapi.contentTypes["api::order.order"]
                  });

                console.log('find🟠', find)

                const nodes = await find(parent, { filters: transformedArgs });

                console.log('nodes🟠', nodes)


                if (nodes.length > 0) {
                  return {
                    value: nodes[0]
                  };
                } else {
                  throw new Error(ctx.koaContext.response.message);
                }
              }
            });
          }
        }),

        /* 💖⛔⛔⛔🈸🈚 */

        nexus.extendType({
          type: "Mutation",
          definition(t) {
            t.field("updateOrderComplate", {
              type: "OrderEntityResponse",
              args: { code: nexus.stringArg() },
              async resolve(parent, args, context) {

                const contentType = strapi.contentTypes["api::order.order"]

                // get order id by code:
                const { find } = strapi.plugin("graphql")
                  .service("builders")
                  .get("content-api")
                  .buildQueriesResolvers({ contentType });
                const nodes = await find(parent, { filters: args });

                const argsToUpdate = {
                  id: nodes[0].id,
                  data: {
                    status: "completed"
                  }
                }

                const transformedArgs = transformArgs(argsToUpdate, { contentType });

                // Sanitize input data
                // const sanitizedInputData = await sanitize.contentAPI.input(
                //   transformedArgs.data,
                //   contentType,
                //   { auth }
                // );

                // Object.assign(transformedArgs, { data: sanitizedInputData });

                const { update } = strapi.plugin("graphql")
                  .service("builders")
                  .get("content-api")
                  .buildMutationsResolvers({ contentType });


                const value = await update(parent, transformedArgs);

                return toEntityResponse(value, { args: transformedArgs, resourceUID: contentType });
              },

            });
          }
        }),



      ],
      resolversConfig: {
        "Query.orderByCode": {
          auth: false
        },
        "Mutation.updateOrderComplate": {
          auth: false
        }
      },
    });

    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) { },
};
