import * as _ from 'lodash';
import { Repository, QueryRunner } from 'typeorm';

export type RepositoryJoin<T = any> = {
  field: string;
  select?: (keyof T)[];
};

export type RepositoryOrder = Record<string, 'ASC' | 'DESC'>;

export type RepositoryFindOptions = {
  page?: number;
  limit?: number;
  order?: RepositoryOrder;
  joins?: RepositoryJoin[];
  select?: string[];
  //   omit?: string[];
};

export function transformRepositoryFindOptions(opts?: RepositoryFindOptions): {
  typeormQuery: Record<string, boolean | Record<string, boolean>>;
  pagination: { limit: number; page: number };
} {
  if (!opts || _.isEmpty(opts))
    return {
      typeormQuery: null,
      pagination: null,
    };

  const optsObj = {};

  // Handle limit query
  if (!opts?.limit || opts?.limit < 1) opts.limit = 20;
  if (opts?.limit) {
    optsObj['take'] = opts?.limit;
  }

  // Handle skip query
  if (!opts?.page || opts?.page < 1) opts.page = 1;
  if (opts?.page) {
    optsObj['skip'] = (opts?.page - 1) * opts?.limit;
  }

  // Handle order query
  if (opts?.order) {
    optsObj['order'] = opts?.order;
  }

  // Handle select query
  if (opts?.select && !_.isEmpty(opts?.select)) {
    const select = { id: true };
    opts.select.forEach((prop) => {
      select[prop] = true;
    });
    optsObj['select'] = { ...optsObj['select'], ...select };
  }

  // Handle join query
  if (opts?.joins && !_.isEmpty(opts?.joins)) {
    const relations = {};
    opts?.joins.forEach((obj) => {
      relations[obj?.field] = true;
      if (obj?.select || obj?.select?.length > 0) {
        const objSelect = { id: true };
        const relationFieldSelect = {};
        obj?.select.forEach((prop) => {
          relationFieldSelect[prop] = true;
        });
        objSelect[obj?.field] = relationFieldSelect;
        optsObj['select'] = { ...(optsObj['select'] || {}), ...objSelect };
      }
    });
    optsObj['relations'] = { ...relations };
  }

  //   if (opts?.omit && !_.isEmpty(opts?.omit)) {
  //     const omit = {};
  //     opts.omit.forEach((prop) => {
  //       omit[prop] = false;
  //     });
  //     optsObj['select'] = { ...optsObj['select'], ...omit };
  //   }

  const pagination = {
    limit: opts?.limit,
    page: opts?.page,
  };

  return { typeormQuery: optsObj, pagination };
}

export function paginate<T>(data: {
  limit: number;
  page: number;
  count: number;
  docs: T;
}) {
  const totalPages = Math.ceil(data?.count / data?.limit);

  return {
    limit: data?.limit,
    page: data?.page,
    totalPages: totalPages,
    totalRecords: data.count,
    records: data?.docs,
  };
}

export function _paginate<T>(data: {
  limit: number;
  page: number;
  count: number;
  docs: T;
}) {
  const totalPages = data?.count / data?.limit;

  return {
    limit: data?.limit,
    page: data?.page,
    totalPages: totalPages,
    totalRecords: data.count,
    records: data?.docs,
  };
}

type InputType<T> = T extends (...args: infer Args) => any ? Args : never;

export function wrapTransaction<T extends (...args: any) => any>(
  repo: Repository<any>,
  trx: QueryRunner | null,
  method: keyof Repository<any>,
  ...args: InputType<T>
) {
  const entity = repo.target;

  switch (method) {
    case 'save': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'remove': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'softRemove': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'recover': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'update': {
      return (
        trx
          ? trx.manager[method](entity, args[0], args[1])
          : repo[method](args[0], args[1])
      ) as ReturnType<T>;
    }

    case 'upsert': {
      return (
        trx
          ? trx.manager[method](entity, args[0], args[1])
          : repo[method](args[0], args[1])
      ) as ReturnType<T>;
    }

    case 'delete': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'softDelete': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'restore': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'exists': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'existsBy': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'count': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'countBy': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'sum': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'average': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }
    case 'minimum': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'maximum': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'find': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'findBy': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'findAndCount': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'findAndCountBy': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'findOne': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'findOneBy': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'findOneOrFail': {
      return (
        trx ? trx.manager[method](entity, args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'findOneByOrFail': {
      return (
        trx ? trx.manager[method](entity, args) : repo[method](args)
      ) as ReturnType<T>;
    }

    case 'query': {
      return (
        trx ? trx.manager[method](args[0]) : repo[method](args[0])
      ) as ReturnType<T>;
    }

    case 'increment': {
      return (
        trx
          ? trx.manager[method](entity, args[0], args[1], args[2])
          : repo[method](args[0], args[1], args[2])
      ) as ReturnType<T>;
    }

    case 'decrement': {
      return (
        trx
          ? trx.manager[method](entity, args[0], args[1], args[2])
          : repo[method](args[0], args[1], args[2])
      ) as ReturnType<T>;
    }
  }
}
