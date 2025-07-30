import { isString, isPlainObject, isArray } from 'lodash';

//模板转换函数，将一个由双大括号包裹的字符串，转化为js表达式并返回结果（context限制变量范围）
export const templateParse = (str, context) => {
  if (!str) return str;
  if (typeof str !== 'string') return str;

  const template = str.match(/{{(.+?)}}/);
  if (template) {
    try {
      const parse = new Function(
        Object.keys(context).join(','),
        'return ' + template[1],
      );

      return parse(...Object.values(context));
    } catch (e) {
      return str;
    }
  } else {
    return str;
  }
};

export const deepParse = (prop, context) => {
  if (isString(prop)) {
    return templateParse(prop, context);
  }
  if (isPlainObject(prop)) {
    return Object.keys(prop).reduce((all, key) => {
      if (prop.name) {
        return {
          ...all,
          [key]: deepParse(prop[key], {
            ...context,
            // $value: context.$form[prop.name],
          }),
        };
      }
      return { ...all, [key]: deepParse(prop[key], context) };
    }, {});
  }
  if (isArray(prop)) {
    return prop.map((item) => deepParse(item, context));
  }

  return prop;
};
