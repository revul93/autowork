const geAtttributeValueOfModel = async (attribute, value, Model) => {
  try {
    const queryResult = await Model.findOne({
      where: {
        [attribute]: value,
      },
    });
    const result = queryResult[attribute];
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { geAtttributeValueOfModel };
