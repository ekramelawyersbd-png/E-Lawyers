const fs = require('fs');
let content = fs.readFileSync('src/components/Comments.tsx', 'utf8');

content = content.replace(
  `                    ) : (
                    <div className="flex items-center gap-2 mb-3">`,
  `                    ) : (<>
                    <div className="flex items-center gap-2 mb-3">`
);

content = content.replace(
  `                        <Send className="w-3 h-3" />
                        <span>{isSubmittingReply ? "Posting..." : "Post Reply"}</span>
                      </button>
                    </div>
                    )}
                  </div>
                )}`,
  `                        <Send className="w-3 h-3" />
                        <span>{isSubmittingReply ? "Posting..." : "Post Reply"}</span>
                      </button>
                    </div>
                    </>)}
                  </div>
                )}`
);

fs.writeFileSync('src/components/Comments.tsx', content);
console.log('patched fragment');
