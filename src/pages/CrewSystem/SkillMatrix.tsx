import { memo } from "react";
import { useCrewManagementStore } from "@/stores/crewManagementStore";
import Panel from "@/components/ui/Panel";
import { Award } from "lucide-react";

const categoryLabels: Record<string, string> = {
  engineering: "工程",
  science: "科学",
  medical: "医疗",
  piloting: "航行",
  command: "指挥",
};

const SkillMatrix = memo(function SkillMatrix() {
  const crew = useCrewManagementStore((s) => s.crew);

  return (
    <Panel title="技能矩阵" icon={<Award size={14} />}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 px-3 text-gray-500 font-rajdhani">船员</th>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <th key={key} className="text-center py-2 px-3 text-gray-500 font-rajdhani">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {crew.map((member) => (
              <tr key={member.id} className="border-b border-gray-800/50 hover:bg-space-800/30">
                <td className="py-2 px-3 text-gray-200 font-rajdhani">{member.name}</td>
                {Object.keys(categoryLabels).map((category) => {
                  const categorySkills = member.skills.filter((s) => s.category === category);
                  const avgLevel = categorySkills.length > 0
                    ? Math.round(categorySkills.reduce((sum, s) => sum + s.level, 0) / categorySkills.length)
                    : 0;
                  return (
                    <td key={category} className="py-2 px-3 text-center">
                      {avgLevel > 0 ? (
                        <span className={`font-rajdhani font-bold ${
                          avgLevel >= 90 ? "text-cyber-green" :
                          avgLevel >= 70 ? "text-cyber-blue" :
                          avgLevel >= 50 ? "text-cyber-amber" : "text-gray-400"
                        }`}>
                          {avgLevel}
                        </span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
});

export default SkillMatrix;
